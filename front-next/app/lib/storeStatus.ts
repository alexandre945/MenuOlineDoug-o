function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(h: number, m: number) {
  return `${pad2(h)}:${pad2(m)}`;
}

function weekdayNamePt(day: number) {
  const names = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  return names[day] ?? "";
}

function nextOpenDay(fromDay: number) {
  let d = (fromDay + 1) % 7;
  while (d === 1) d = (d + 1) % 7; // pula segunda
  return d;
}

export function getStoreStatus(now = new Date()) {
  const day = now.getDay();

  const openH = 19, openM = 0;
  const closeH = 23, closeM = 30;

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const openMin = openH * 60 + openM;
  const closeMin = closeH * 60 + closeM;

  // Segunda
  if (day === 1) {
    return {
      isOpen: false,
      message: `Fechado hoje (segunda). Abriremos terça às ${formatTime(openH, openM)}.`,
    };
  }

  // Aberto
  if (minutesNow >= openMin && minutesNow <= closeMin) {
    return {
      isOpen: true,
      message: `Estamos abertos agora até as ${formatTime(closeH, closeM)}.`,
    };
  }

  // Antes de abrir
  if (minutesNow < openMin) {
    return {
      isOpen: false,
      message: `Fechado. Abriremos hoje às ${formatTime(openH, openM)}.`,
    };
  }

  // Depois de fechar
  const nextDay = nextOpenDay(day);
  return {
    isOpen: false,
    message: `Já fechamos hoje. Abriremos ${weekdayNamePt(nextDay)} às ${formatTime(
      openH,
      openM
    )}.`,
  };
}
