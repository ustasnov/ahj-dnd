import { State } from "../state";

test("state should save and load array", () => {
  const state = new State("test");
  const sourceData = ["one", "two", "three"];
  state.save(sourceData);
  const destData = state.load();

  expect(sourceData).toEqual(destData);
});

test("state should clear stored data", () => {
  const state = new State("test");
  const sourceData = ["one", "two", "three"];
  state.save(sourceData);
  state.clear();
  const destData = state.load();

  expect(destData).toBe(null);
});