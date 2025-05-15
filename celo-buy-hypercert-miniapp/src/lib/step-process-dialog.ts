import { createContext, useContext } from "react";

type StepState = "idle" | "active" | "completed" | "error";
  type StepData = Pick<DialogStep, "id" | "description">;

  type DialogStep = {
    id: string;
    description: string;
    state: StepState;
    errorMessage?: string;
  };
  
  const StepProcessDialogContext = createContext<{
    open: boolean;
    setDialogStep: (
      step: DialogStep["id"],
      newState?: StepState,
      errorMessage?: string,
    ) => Promise<void>;
    setSteps: React.Dispatch<React.SetStateAction<StepData[]>>;
    setOpen: (open: boolean) => void;
    setTitle: (title: string) => void;
    dialogSteps: DialogStep[];
    setExtraContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  }>({
    open: false,
    setDialogStep: async () => Promise.resolve(),
    setSteps: () => {},
    setOpen: () => {},
    setTitle: () => {},
    dialogSteps: [],
    setExtraContent: () => {},
  });

  export const useStepProcessDialogContext = () => {
    const context = useContext(StepProcessDialogContext);
    if (!context) {
      throw new Error(
        "useStepProcessDialogContext must be used within a StepProcessDialogProvider",
      );
    }
    return context;
  };