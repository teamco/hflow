import { getExtension, getFileFromUrl, getImageDimensions, toFile } from '@/utils/file';

describe('getExtension_function', () => {
  test("test_base64WithValidDataAndExtension", () => {
    const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACW0lEQVR4nL2Tz0sTURjHv7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzP//2Q==";
    const expected = "png";
    expect(getExtension(base64)).toBe(expected);
  });

  test("test_base64WithValidDataAndNoExtension", () => {
    const base64 = "data:image;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACW0lEQVR4nL2Tz0sTURjHv7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzP//2Q==";
    const expected = undefined;
    expect(getExtension(base64)).toBe(expected);
  });

  test("test_base64WithInvalidFormat", () => {
    const base64 = "invalidFormat";
    const expected = undefined;
    expect(getExtension(base64)).toBe(expected);
  });

  test("test_noMatchFound", () => {
    const base64 = "data:;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACW0lEQVR4nL2Tz0sTURjHv7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzP//2Q==";
    const expected = undefined;
    expect(getExtension(base64)).toBe(expected);
  });

  test("test_uppercaseFileExtensions", () => {
    const base64 = "data:image/PNG;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACW0lEQVR4nL2Tz0sTURjHv7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzO7MzP//2Q==";
    const expected = "PNG";
    expect(getExtension(base64)).toBe(expected);
  });
});

describe('toFile_function', () => {
  test("test_fileToBase64", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const result = await toFile({ file });
    expect(typeof result).toBe("string");
    expect(result).toContain("data:text/plain;base64,");
  });

  test("test_entityTypeToValue", () => {
    const entity = { id: 1, name: "Test Entity", image: "test.jpg" };
    const type = "image";
    const result = toFile({ entity, type, isEdit: true });
    expect(result).toBe(entity[type]);
  });

  test("test_returnPromise", () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const result = toFile({ file });
    expect(result instanceof Promise).toBe(true);
  });
});

describe('getImageDimensions_function', () => {
  test("test_promiseReturned", () => {
    const result = getImageDimensions({ url: "https://via.placeholder.com/150" });
    expect(result).toBeInstanceOf(Promise);
  });

  test("test_asyncFunction", () => {
    expect(getImageDimensions.constructor.name).toBe("AsyncFunction");
  });
});

describe('getFileFromUrl_function', () => {
  test("test_fetch_failure", async () => {
    const url = "https://example.com/invalid";
    await expect(getFileFromUrl(url)).rejects.toThrow();
  });
});

