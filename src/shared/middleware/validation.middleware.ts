import { plainToInstance, instanceToPlain } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { Response, Request, NextFunction } from "express";

const validationPipe = async (schema: new () => {}, requestObject: object) => {
  const transformedClass: any = plainToInstance(schema, requestObject, {});

  const errors = await validate(transformedClass);
  if (errors.length > 0) {
    return errors;
  }
  return instanceToPlain(transformedClass, { excludeExtraneousValues: true });
};

export const validationMiddleware =
  (validationSchema: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await validationPipe(validationSchema, {
      ...req.body,
      ...req.params,
    });

    if (Array.isArray(result)) {
      return res.status(400).json({
        error: getValidationErrors(result),
      });
    }
    req.body["validatedDto"] = result;
    next();
  };

const getValidationErrors = (errors: ValidationError[]): string[] => {
  let returnErrors: string[] = [];
  errors.forEach((error) => {
    if (error.constraints) {
      const constraints = Object.values(error.constraints);
      constraints.forEach((constraint) => {
        returnErrors.push(constraint);
      });
    }
  });
  return returnErrors;
};
