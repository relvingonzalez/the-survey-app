import postgres from "postgres";
import { Comment } from "../../../internal";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  transform: {
    ...postgres.camel,
    // undefined: "DEFAULT",
  },
  types: {
    responseComment: {
      // The pg_types oid to pass to the db along with the serialized value.
      to: 311298,

      // An array of pg_types oids to handle when parsing values coming from the db.
      from: [311298],

      //Function that transform values before sending them to the db.
      serialize: ({ id, questionId, comment, responseGroupId }: Comment) => [
        id,
        questionId,
        comment,
        responseGroupId,
      ],

      // Function that transforms values coming from the db.
      parse: ([id, questionId, comment, responseGroupId]: [
        id: number,
        questionId: number,
        comment: string,
        responseGroupId: number,
      ]) => ({ id, questionId, comment, responseGroupId }),
    },
  },
});

export default sql;
