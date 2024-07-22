import type { Dimensions, Vec2, Vec2Tuple } from "../types";

/**
 * Creates a vector object from an x and y component
 * 
 * @param x The x component of the vector, defaults to 0.5
 * @param y The y component of the vector, defaults to 0.5
 * 
 * @returns a vector object 
 */
export const buildVec2 = (x = 0.5, y = 0.5): Vec2 => {
  return { x, y };
};

/**
 * Converts a percent-normalized vector into a vector based on an output
 * screen size
 * 
 * @param normalizedVec the input vector, with percent-normalized units
 * @param screen the dimensions of the output screen of the vector to \
 * denormalize against.
 * 
 * @returns a denormalized vector where the units are the same as the input \
 * screen dimensions
 */
export const getRenderedPosition = (
  normalizedVec: Vec2,
  screen: Dimensions,
): Vec2 => {
  return {
    x: normalizedVec.x * screen.width,
    y: normalizedVec.y * screen.height,
  };
};

/**
 * Converts a percent-normalized vector into a vector tuple based on an output
 * screen size
 * 
 * @param normalizedVec the input vector, with percent-normalized units
 * @param screen the dimensions of the output screen of the vector to \
 * denormalize against.
 * 
 * @returns a denormalized vector tuple where the units are the same as the \
 * input screen dimensions
 */
export const getRenderedPositionTuple = (
  normalizedVec: Vec2,
  screen: Dimensions,
): Vec2Tuple => {
  const { x, y } = getRenderedPosition(normalizedVec, screen);

  return [x, y];
};