import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    members: i.entity({
      shortId: i.string().unique().indexed(),
      name: i.string(),
      role: i.string(),
      color: i.string(),
      isExternal: i.boolean(),
      avatar: i.string().optional(),
      isLive: i.boolean(),
    }),
    // RADIOACTIVE: real Oura OAuth tokens. Fully client-locked in instant.perms.ts —
    // only the server-side Admin SDK (INSTANT_ADMIN_TOKEN) may read/write this entity.
    ouraTokens: i.entity({
      memberId: i.string().indexed(),
      accessToken: i.string(),
      refreshToken: i.string(),
      expiresAt: i.number(),
    }),
    consents: i.entity({
      memberId: i.string().indexed(),
      metric: i.string(),
      shareOnLeaderboard: i.boolean(),
    }),
    dailyScores: i.entity({
      memberId: i.string().indexed(),
      day: i.string().indexed(),
      readiness: i.number(),
      sleep: i.number(),
      activity: i.number(),
      steps: i.number(),
      source: i.string(),
    }),
  },
  links: {},
});

type _AppSchema = typeof _schema;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- InstantDB's documented schema re-export pattern
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
