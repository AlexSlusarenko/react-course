export const updateObject = (oldState, updatedProps) => {
  return {
    ...oldState,
    ...updatedProps,
  }
};
