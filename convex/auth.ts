import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { customCtx, customMutation, customQuery } from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";
import { ResendOTP } from "./ResendOTP";
import { mutation, query } from "./_generated/server";
 
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
});

/** Custom query that requires authentication */
export const queryWithAuth = customQuery(
  query,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("NON_AUTHENTICATED");
    }
    // Return an object to extend ctx with userId
    return { authUserId: userId };
  })
);

/** Custom mutation that requires authentication */
export const mutationWithAuth = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("NON_AUTHENTICATED");
    }
    // Return an object to extend ctx with userId
    return { authUserId: userId };
  })
);
