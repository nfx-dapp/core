import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { multerUploader } from "./helpers";

export function paginate(defaultLimit = 10) {
  return (req: Request, res: Response, next: NextFunction) => {
    let { limit, page } = req.query;
    const errors = [];
    if (!limit) {
      req.query.limit = defaultLimit.toString();
    } else {
      if (typeof limit === "string") {
        try {
          if (parseInt(req.query.limit as string) <= 0) {
            errors.push({
              msg: "limit value can only be positive number",
              param: "limit",
              location: "query",
            });
          }
        } catch (err) {
          errors.push({
            msg: "invalid limit value",
            param: "limit",
            location: "query",
          });
          req.query.limit = undefined;
        }
      }
    }
    if (!page) {
      req.query.page = "1";
    } else {
      if (typeof page === "string") {
        try {
          if (parseInt(req.query.page as string) <= 0) {
            errors.push({
              msg: "page value can only be positive number",
              param: "page",
              location: "query",
            });
          }
        } catch (err) {
          errors.push({
            msg: "invalid page value",
            param: "page",
            location: "query",
          });
          req.query.page = undefined;
        }
      }
    }
    if (errors.length !== 0) (req as any).paginationErrors = errors;
    else
      req.query.offset = (
        Number(req.query.limit) *
        (Number(req.query.page) - 1)
      ).toString();
    next();
  };
}

export function files({
  name,
  type,
  min,
  max,
}: {
  name: string;
  type: string;
  min?: number;
  max?: number;
}) {
  min = min === undefined ? 1 : min;

  return (req: Request, res: Response, next: NextFunction) => {
    multerUploader.array(name)(req, res, () => {
      const files = req.files;

      console.log(files);

      let error;
      if (!files) {
        error = {
          msg: "files not found",
          param: name,
          location: "body",
        };
      } else if ((files.length as number) < (min as number)) {
        error = {
          msg: `atleast ${min} files are required`,
          param: name,
          location: "body",
        };
      } else if (max !== undefined && (files.length as number) > max) {
        error = {
          msg: `atmost ${max} files are allowed`,
          param: name,
          location: "body",
        };
      } else {
        for (const file of files as Express.Multer.File[]) {
          if (!file.mimetype.includes(type)) {
            error = {
              msg: "invalid file format",
              param: name,
              location: "body",
            };
            break;
          }
        }
      }
      if (error) {
        if (typeof (req as any).fileErrors === "object") {
          (req as any).fileErrors.push(error);
        } else {
          (req as any).fileErrors = [error];
        }
      }
      next();
    });
  };
}

interface Error {
  msg: string;
  param: string;
  location: string;
}

export function filesWithFields(
  fields: { name: string; type: string; min?: number; max?: number }[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    multerUploader.fields(fields.map(({ name }) => ({ name })))(
      req,
      res,
      () => {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        console.log(files);
        let errors: Error[] = [];

        if (!files) {
          errors = fields.map((field) => ({
            msg: "files not found",
            param: field.name,
            location: "body",
          }));
        } else {
          for (const field of fields) {
            field.min = field.min === undefined ? 1 : field.min;
            let error: Error | null = null;
            if (!files[field.name]) {
              error = {
                msg: "files not found",
                param: field.name,
                location: "body",
              };
            } else if (
              (files[field.name].length as number) < (field.min as number)
            ) {
              error = {
                msg: `atleast ${field.min} files are required`,
                param: field.name,
                location: "body",
              };
            } else if (
              field.max !== undefined &&
              (files[field.name].length as number) > field.max
            ) {
              error = {
                msg: `atmost ${field.max} files are allowed`,
                param: field.name,
                location: "body",
              };
            } else {
              for (const file of files[field.name]) {
                if (!file.mimetype.includes(field.type)) {
                  error = {
                    msg: "invalid file format",
                    param: field.name,
                    location: "body",
                  };
                  break;
                }
              }
            }

            if (error !== null) errors.push(error);
          }
        }
        if (errors.length !== 0) {
          if (typeof (req as any).fileErrors === "object") {
            for (const error of errors) {
              (req as any).fileErrors.push(error);
            }
          } else {
            (req as any).fileErrors = errors;
          }
        }
        next();
      }
    );
  };
}

export function file({ name, type }: { name: string; type: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    multerUploader.single(name)(req, res, () => {
      const file = req.file;
      let error;
      if (!file) {
        error = {
          msg: "file not found",
          param: name,
          location: "body",
        };
      } else if (!file.mimetype.includes(type)) {
        error = {
          msg: "invalid file format",
          param: name,
          location: "body",
        };
      }
      if (error) {
        if (typeof (req as any).fileErrors === "object") {
          (req as any).fileErrors.push(error);
        } else {
          (req as any).fileErrors = [error];
        }
      }
      next();
    });
  };
}

export function validate(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  let errors = result
    .array()
    .concat((req as any).fileErrors || [])
    .concat((req as any).paginationErrors || []);
  if (errors.length !== 0) {
    return res.status(422).json({ errors });
  }
  next();
}
