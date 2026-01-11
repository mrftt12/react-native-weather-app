declare module "openmeteo" {
  export function fetchWeatherApi(
    url: string,
    params: Record<string, any>
  ): Promise<any[]>;
}
