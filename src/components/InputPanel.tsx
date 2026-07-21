import { useId, useState, type FormEvent } from "react";
import type { RawDimensions } from "../lib/calculations";

interface InputPanelProps {
  defaultValues: RawDimensions;
  onChange: (dimensions: RawDimensions) => void;
  onCalculate: (dimensions: RawDimensions) => void;
}

interface FieldErrors {
  udda?: string;
  agala?: string;
}

function validate(d: RawDimensions): FieldErrors {
  const errors: FieldErrors = {};
  if (d.uddaFeet <= 0 && d.uddaInches <= 0) {
    errors.udda = "Enter a height (Udda) greater than 0.";
  }
  if (d.agalaFeet <= 0 && d.agalaInches <= 0) {
    errors.agala = "Enter a width (Agala) greater than 0.";
  }
  return errors;
}

function clampFeet(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(999, Math.round(n)));
}

function clampInchesTyped(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.round(n));
}

interface StepperFieldProps {
  id: string;
  label: string;
  value: number;
  suffix: string;
  onStep: (delta: number) => void;
  onTypedChange: (value: number) => void;
  min?: number;
}

function StepperField({ id, label, value, suffix, onStep, onTypedChange, min = 0 }: StepperFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-ink/60">
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-neela/20 bg-limewash-raised focus-within:border-neela">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label={`Decrease ${label}`}
          className="w-9 shrink-0 border-r border-neela/15 text-lg font-medium text-neela transition-colors hover:bg-neela-soft active:bg-neela/20"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          value={value}
          onChange={(e) => onTypedChange(Number(e.target.value))}
          className="w-full min-w-0 appearance-none bg-transparent px-2 py-2 text-center font-body text-lg tabular-nums text-ink outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label={`Increase ${label}`}
          className="w-9 shrink-0 border-l border-neela/15 text-lg font-medium text-neela transition-colors hover:bg-neela-soft active:bg-neela/20"
        >
          +
        </button>
      </div>
      <span className="text-[11px] text-ink/40">{suffix}</span>
    </div>
  );
}

export function InputPanel({ defaultValues, onChange, onCalculate }: InputPanelProps) {
  const [dims, setDims] = useState<RawDimensions>(defaultValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uddaNote, setUddaNote] = useState<string | null>(null);
  const [agalaNote, setAgalaNote] = useState<string | null>(null);
  const formId = useId();

  function commit(next: RawDimensions) {
    setDims(next);
    onChange(next);
    return next;
  }

  function stepUddaFeet(delta: number) {
    const next = commit({ ...dims, uddaFeet: Math.max(0, dims.uddaFeet + delta) });
    setErrors(validate(next));
    onCalculate(next);
  }

  function stepAgalaFeet(delta: number) {
    const next = commit({ ...dims, agalaFeet: Math.max(0, dims.agalaFeet + delta) });
    setErrors(validate(next));
    onCalculate(next);
  }

  function stepUddaInches(delta: number) {
    const total = Math.max(0, dims.uddaFeet * 12 + dims.uddaInches + delta);
    const feet = Math.floor(total / 12);
    const inches = total % 12;
    const next = commit({ ...dims, uddaFeet: feet, uddaInches: inches });
    setUddaNote(feet !== dims.uddaFeet ? `Adjusted to ${feet} ft ${inches} in` : null);
    setErrors(validate(next));
    onCalculate(next);
  }

  function stepAgalaInches(delta: number) {
    const total = Math.max(0, dims.agalaFeet * 12 + dims.agalaInches + delta);
    const feet = Math.floor(total / 12);
    const inches = total % 12;
    const next = commit({ ...dims, agalaFeet: feet, agalaInches: inches });
    setAgalaNote(feet !== dims.agalaFeet ? `Adjusted to ${feet} ft ${inches} in` : null);
    setErrors(validate(next));
    onCalculate(next);
  }

  function typeUddaFeet(v: number) {
    setUddaNote(null);
    commit({ ...dims, uddaFeet: clampFeet(v) });
  }

  function typeAgalaFeet(v: number) {
    setAgalaNote(null);
    commit({ ...dims, agalaFeet: clampFeet(v) });
  }

  function typeUddaInches(v: number) {
    const raw = clampInchesTyped(v);
    if (raw >= 12) {
      const total = dims.uddaFeet * 12 + raw;
      const feet = Math.floor(total / 12);
      const inches = total % 12;
      commit({ ...dims, uddaFeet: feet, uddaInches: inches });
      setUddaNote(`Adjusted to ${feet} ft ${inches} in`);
    } else {
      commit({ ...dims, uddaInches: raw });
      setUddaNote(null);
    }
  }

  function typeAgalaInches(v: number) {
    const raw = clampInchesTyped(v);
    if (raw >= 12) {
      const total = dims.agalaFeet * 12 + raw;
      const feet = Math.floor(total / 12);
      const inches = total % 12;
      commit({ ...dims, agalaFeet: feet, agalaInches: inches });
      setAgalaNote(`Adjusted to ${feet} ft ${inches} in`);
    } else {
      commit({ ...dims, agalaInches: raw });
      setAgalaNote(null);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(dims);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length === 0) {
      onCalculate(dims);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 font-display text-lg text-neela">
            Udda <span className="font-body text-base text-ink/50">(ಉದ್ದ)</span>
          </legend>
          <p className="-mt-2 text-xs text-ink/50">Height / length</p>
          <div className="grid grid-cols-2 gap-3">
            <StepperField
              id={`${formId}-udda-feet`}
              label="Feet"
              value={dims.uddaFeet}
              suffix="ft"
              onStep={stepUddaFeet}
              onTypedChange={typeUddaFeet}
            />
            <StepperField
              id={`${formId}-udda-inches`}
              label="Inches"
              value={dims.uddaInches}
              suffix="in (0–11, carries over past 11)"
              onStep={stepUddaInches}
              onTypedChange={typeUddaInches}
            />
          </div>
          {uddaNote && <p className="text-xs font-medium text-neela">{uddaNote}</p>}
          {errors.udda && (
            <p role="alert" className="text-xs font-medium text-kavi">
              {errors.udda}
            </p>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 font-display text-lg text-neela">
            Agala <span className="font-body text-base text-ink/50">(ಅಗಲ)</span>
          </legend>
          <p className="-mt-2 text-xs text-ink/50">Width</p>
          <div className="grid grid-cols-2 gap-3">
            <StepperField
              id={`${formId}-agala-feet`}
              label="Feet"
              value={dims.agalaFeet}
              suffix="ft"
              onStep={stepAgalaFeet}
              onTypedChange={typeAgalaFeet}
            />
            <StepperField
              id={`${formId}-agala-inches`}
              label="Inches"
              value={dims.agalaInches}
              suffix="in (0–11, carries over past 11)"
              onStep={stepAgalaInches}
              onTypedChange={typeAgalaInches}
            />
          </div>
          {agalaNote && <p className="text-xs font-medium text-neela">{agalaNote}</p>}
          {errors.agala && (
            <p role="alert" className="text-xs font-medium text-kavi">
              {errors.agala}
            </p>
          )}
        </fieldset>
      </div>

      <button
        type="submit"
        className="self-start rounded-lg bg-neela px-6 py-3 font-display text-base font-medium text-limewash shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
      >
        Calculate
      </button>
    </form>
  );
}
