"use client";

import { useCallback, useEffect, useRef } from "react";
import { driver, type DriveStep, type Driver, type Config } from "driver.js";

type StepsFactory = () => DriveStep[];

const isStepElementAvailable = (step: DriveStep) => {
  if (!step.element) {
    return false;
  }

  if (typeof step.element === "string") {
    return Boolean(document.querySelector(step.element));
  }

  if (typeof step.element === "function") {
    try {
      return Boolean(step.element());
    } catch {
      return false;
    }
  }

  return true;
};

export const useDriverTour = (stepsFactory: StepsFactory) => {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, []);

  const startTour = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const availableSteps = stepsFactory().filter(isStepElementAvailable);

    if (!availableSteps.length) {
      return;
    }

    const baseConfig: Config = {
      allowClose: true,
      allowKeyboardControl: true,
      smoothScroll: true,
      showProgress: true,
      overlayColor: "rgba(15, 23, 42, 0.7)",
      steps: availableSteps,
      nextBtnText: "Próximo",
      prevBtnText: "Voltar",
      doneBtnText: "Concluir",
    };

    if (!driverRef.current) {
      driverRef.current = driver(baseConfig);
    } else {
      const currentConfig = driverRef.current.getConfig();
      driverRef.current.setConfig({ ...currentConfig, ...baseConfig });
      driverRef.current.setSteps(availableSteps);
    }

    driverRef.current.drive();
  }, [stepsFactory]);

  return { startTour };
};

export type { DriveStep };
