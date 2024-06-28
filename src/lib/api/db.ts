import postgres from "postgres";
import { DexieComment } from "../types/dexie";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  transform: {
    ...postgres.camel,
  },
  types: {
    responseComment: {
      // The pg_types oid to pass to the db along with the serialized value.
      to: 311298,

      // An array of pg_types oids to handle when parsing values coming from the db.
      from: [311298],

      //Function that transform values before sending them to the db.
      serialize: ({
        id,
        questionId,
        comment,
        collectionOrder,
      }: DexieComment) => [id, questionId, comment, collectionOrder],

      // Function that transforms values coming from the db.
      parse: ([id, questionId, comment, collectionOrder]: [
        id: number,
        questionId: number,
        comment: string,
        collectionOrder: number,
      ]) => ({ id, questionId, comment, collectionOrder }),
    },
  },
});

export default sql;
