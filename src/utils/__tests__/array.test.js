import { sortByDate } from '@/utils/array';

describe('@/utils/array.js', () => {
  it("test_validDateValues", () => {
    const list = [
      { date: "2022-01-01" },
      { date: "2021-12-31" },
      { date: "2022-01-02" }
    ];

    const sortedList = sortByDate(list, "date");
    expect(sortedList).toEqual([
      { date: "2021-12-31" },
      { date: "2022-01-01" },
      { date: "2022-01-02" }
    ]);
  });

  it("test_sameLength", () => {
    const list = [
      { date: "2022-01-01" },
      { date: "2021-12-31" },
      { date: "2022-01-02" }
    ];

    const sortedList = sortByDate(list, "date");
    expect(sortedList.length).toBe(list.length);
  });

  it("test_emptyList", () => {
    const list = [];
    const sortedList = sortByDate(list, "date");
    expect(sortedList).toEqual([]);
  });

  it("test_oneObject", () => {
    const list = [{ date: "2022-01-01" }];
    const sortedList = sortByDate(list, "date");
    expect(sortedList).toEqual([{ date: "2022-01-01" }]);
  });
});