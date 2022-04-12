import { Exclude, Expose, Transform } from "class-transformer";

// re-implement base Document to allow class-transformer to serialize/deserialize its properties
// This class is needed, otherwise "_id" and "__v" would be excluded from the output
export class BaseDocument {
  @Expose()
  // makes sure that when deserializing from a Mongoose Object, ObjectId is serialized into a string
  @Transform((value) => {
    if ("value" in value) {
      // HACK: this is changed because of https://github.com/typestack/class-transformer/issues/879
      // return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
      return value.obj[value.key].toString();
    }

    return "unknown value";
  })
  public _id!: string;

  @Exclude()
  public __v!: number;
}
