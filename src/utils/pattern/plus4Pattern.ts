export function createPlus4Pattern(
  background: string,
  primary: string,
  secondary: string
) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <rect width="100%" height="100%" fill="${background}"/>

  <path
    fill="none"
    stroke="${primary}"
    stroke-linecap="square"
    stroke-width=".5"
    d="m37.657 10.343-4.243 4.243m-2.828 2.828-4.243 4.243m11.314 0-4.243-4.243m-2.828-2.828-4.243-4.243m-20.686 0-4.243 4.243m-2.828 2.828-4.243 4.243m11.314 0-4.243-4.243m-2.828-2.828-4.243-4.243"
  />

  <path
    fill="none"
    stroke="${secondary}"
    stroke-linecap="square"
    stroke-width=".5"
    d="M16-8v6m0 4v6m8-8h-6m-4 0H8m8 24v6m0 4v6m8-8h-6m-4 0H8"
  />
</svg>
`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}