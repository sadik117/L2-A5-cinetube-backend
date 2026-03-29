import { createAccessControl } from "better-auth/plugins";

// define all resources and actions
export const statement = {
  user: ["create", "read", "update", "delete"],

  media: ["create", "read", "update", "delete"],

  review: [
    "create",
    "read",
    "update",
    "delete",
    "approve",
    "like",
    "comment",
  ],

  watchlist: ["create", "read", "delete"],

  purchase: ["create", "read"],

  analytics: ["read"],
} as const;

const ac = createAccessControl(statement);


export const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"],

  media: ["create", "read", "update", "delete"],

  review: ["read", "delete", "approve"],

  watchlist: ["read"],

  purchase: ["read"],

  analytics: ["read"],
  
});


export const userRole = ac.newRole({
  user: ["read", "update"],

  media: ["read"],

  review: ["create", "read", "update", "delete", "like", "comment"],

  watchlist: ["create", "read", "delete"],

  purchase: ["create", "read"],

});