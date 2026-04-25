import "server-only";

import Preferences from "@/models/Preferences";
import Profile from "@/models/Profile";
import Wallets from "@/models/Wallets";
import User from "@/models/User";
import bcrypt from "bcrypt";
import Reputation from "@/models/Reputation";
import { signToken } from "@/lib/jose";
import { sanitizeUser } from "@/utils/sanitizeUser";
import { CreateUserInput, LoginInput, UpdateUserInput, DeleteUserInput, SetupInput } from "@/types/user.types";
import { getCurrencyByName } from "@/services/server/currency.services";


/* =============================
   ========== CREATE ===========
   ============================= */

export async function createUser(data: CreateUserInput) {
  const { fullname, email, username, password, gender = "" } = data;

  try {
    if (!fullname || !email || !username || !password) {
      throw new Error("Essential fields must be provided");
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
    if (userExists) throw new Error("User already exists");

    const hashedPass = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      fullname,
      email: normalizedEmail,
      username,
      hashedPassword: hashedPass,
      gender,
    });

    const preferences = await Preferences.create({
      userId: createdUser._id,
      show_alerts: false,
      auto_report: true,
      mask_balance: false,
      spend_limit: 0,
    });

    createdUser.preferencesId = preferences._id;
    await createdUser.save();

    return createdUser;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Failed to create user: " + errorMessage);
  }
}

export async function completeUserSetup(userId: string, setupData: SetupInput) {
  const { gender, birthday, country, occupation, currency, spend_limit } = setupData;

  try {
    const [defaultRep, currencyDoc] = await Promise.all([
      Reputation.findOne({ name: "Beginner" }),
      getCurrencyByName(currency ?? ""),
    ]);

    if (!currencyDoc) throw new Error(`Currency "${currency}" not found`);

    const [profile, wallet] = await Promise.all([
      Profile.create({
        userId,
        birthday,
        country,
        occupation,
        reputationId: defaultRep?._id,
      }),
      Wallets.create({
        userId,
        name: "Main Wallet",
        balance: 0,
        currencyId: currencyDoc._id,
      })
    ]);

    await User.findByIdAndUpdate(userId, {
      profileId: profile._id,
      walletId: wallet._id,
      completedSetup: true,
      ...(gender && { gender }),
    });

    await Preferences.findOneAndUpdate({ userId }, { spend_limit });

    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Failed to complete setup: " + errorMessage);
  }
}


/* =============================
   =========== READ ============
   ============================= */

export async function getUserByEmail(email: string) {
  if (!email) throw new Error("Email is required");

  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to get user by email: " + errorMessage);
  }
}

export async function getUserById(id: string) {
  if (!id) throw new Error("Id is required");

  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to get user by id: " + errorMessage);
  }
}

export async function getUserByUsername(username: string) {
  if (!username) throw new Error("Username is required");

  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to get user by username: " + errorMessage);
  }
}

export async function getAllUsers() {
  try {
    const users = await User.find({});
    return users;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to get all users: " + errorMessage);
  }
}

export async function loginUser(data: LoginInput) {
  const { username, password } = data

  if (!username || !password) throw new Error("Please fill all the fields");

  try {
    const user = await getUserByUsername(username);
    if (!user) throw new Error("Invalid credentials");

    if (user.status !== "active") {
      throw new Error("This account isn't active.");
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) throw new Error("Invalid credentials");

    const loggedUser = user.toObject();
    const safeUser = sanitizeUser(loggedUser);

    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    return {
      user: safeUser,
      token,
    };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error(errorMessage);
  }
}

/* =============================
   ========== UPDATE ===========
   ============================= */

export async function updateUser(data: UpdateUserInput) {
  const { id, ...rest } = data;

  if (!id) throw new Error("Id is required");

  try {
    const user = await User.findByIdAndUpdate(id, rest, { new: true });
    return user;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(errorMessage);
    throw new Error("Failed to update user: " + errorMessage);
  }
}

export async function deleteUser(data: DeleteUserInput) {
  const { id } = data;

  if (!id) throw new Error("Id is required");

  try {
    const user = await User.findByIdAndUpdate(id, { status: "deleted" }, { new: true });
    return user;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to delete user: " + errorMessage);
  }
}