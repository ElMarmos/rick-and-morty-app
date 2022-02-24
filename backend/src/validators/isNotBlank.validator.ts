import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Checks if a string is not empty after being trimmed.
 */
export function IsNotBlank(
  nullable = false,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isNotBlank',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} should not be blank`,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          if (nullable && !value) return true;
          if (!nullable && !value) return false;

          return value.trim() !== '';
        },
      },
    });
  };
}
