import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator'

export function IsGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, currentPropertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: currentPropertyName,
      constraints: [property],
      options: {
        message: `${currentPropertyName} must be greater than ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(currentField: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]

          return typeof currentField === typeof relatedValue && currentField > relatedValue
        },
      },
    })
  }
}
