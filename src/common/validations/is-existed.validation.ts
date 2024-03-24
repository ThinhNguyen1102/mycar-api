import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import {Injectable} from '@nestjs/common'
import {DataSource} from 'typeorm'

@ValidatorConstraint({name: 'IsExisted', async: true})
@Injectable()
export class IsExistedRule implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    try {
      const [table, column] = args.constraints

      const count = await this.dataSource.getRepository(table).count({
        where: {
          [column]: value,
        },
      })

      return count > 0
    } catch (e) {
      console.log('Error when validate IsExisted', e)
      return false
    }
  }

  defaultMessage(args: ValidationArguments) {
    const {value} = args
    return `Value ${value} of field ${args.property} does not exist`
  }
}

export function IsExisted(table: string, column: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table, column],
      validator: IsExistedRule,
    })
  }
}
