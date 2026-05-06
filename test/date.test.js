import { formatDate } from "@/utils/date";

describe("formatDate - Formateo de fechas relativas", () => {
  test("debe devolver 'Ahora mismo' para fechas recientes (menos de 1 minuto)", () => {
    const now = new Date();
    expect(formatDate(now.toISOString())).toBe("Ahora mismo");
  });

  test("debe devolver minutos cuando diff < 60 min", () => {
    const past = new Date(Date.now() - 30 * 60 * 1000);
    const result = formatDate(past.toISOString());
    expect(result).toContain("30");
    expect(result).toContain("minute");
  });

  test("debe devolver horas cuando diff < 24 horas", () => {
    const past = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const result = formatDate(past.toISOString());
    expect(result).toContain("5");
    expect(result).toContain("hour");
  });

  test("debe devolver dias cuando diff < 7 dias", () => {
    const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = formatDate(past.toISOString());
    expect(result).toContain("3");
    expect(result).toContain("day");
  });

  test("debe devolver fecha formateada cuando diff >= 7 dias", () => {
    const past = new Date("2025-01-15T10:00:00Z");
    const result = formatDate(past.toISOString());
    expect(result).toContain("2025");
  });

  test("debe manejar singular y plural correctamente", () => {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const result = formatDate(oneMinuteAgo.toISOString());
    expect(result).toContain("minute");
    expect(result).not.toContain("minutes");
  });

  test("debe manejar una fecha futura sin errores", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    expect(() => formatDate(future.toISOString())).not.toThrow();
  });
});
