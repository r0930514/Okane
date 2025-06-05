import {
  ModelDefinition,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, maxlength: 20 })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: raw({
      hash: String,
      salt: String,
    }),
    required: true,
  })
  password: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
