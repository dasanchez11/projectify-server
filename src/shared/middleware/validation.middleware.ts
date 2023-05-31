import { plainToInstance, instanceToPlain } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { Response, Request, NextFunction } from "express";

export const validationPipe = async (
  schema: new () => {},
  requestObject: object
) => {
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
    try {
      const result = await validationPipe(validationSchema, {
        ...req.body,
        ...req.params,
      });

      if (Array.isArray(result)) {
        const message = getValidationErrors(result);
        res.status(400);
        res.json({ message });
        return res;
      }
      req.body["validatedDto"] = result;
      next();
    } catch (error) {
      res.status(500);
      res.json({ message: error.message });
      return res;
    }
  };

export const getValidationErrors = (errors: ValidationError[]): string[] => {
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
