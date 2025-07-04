import { createSelector } from "@reduxjs/toolkit";

const globalState = (state) => state.global;

export const currentLoginDataSelector = createSelector(
  [globalState],
  (state) => state.loginData
)

export const getAllUserDataSelector = createSelector(
  [globalState],
  (state) => state.allUser
)
