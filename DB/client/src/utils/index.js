/**
 * Convert strings from any case to title case
 *
 * e.g. hello_world -> Hello World, member_id -> Member Id
 *
 * @param str
 * @returns {string}
 */
export function titleCase(str) {
  str = str.toLowerCase();
  str = str.split("_");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}
