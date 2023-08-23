import { generateRandom } from '@/utils/common';

describe('generateRandom_function', () => {
  test("test_positive_range", () => {
    const result = generateRandom(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  test("test_negative_range", () => {
    const result = generateRandom(-10, -1);
    expect(result).toBeGreaterThanOrEqual(-10);
    expect(result).toBeLessThanOrEqual(-1);
  });

  test("test_same_numbers", () => {
    const result = generateRandom(5, 5);
    expect(result).toEqual(5);
  });
});
