import React from 'react';
import { Scale } from '../utils/scales';

interface ScaleSelectorProps {
  scales: Scale[];
  selectedScale: Scale;
  onChange: (scale: Scale) => void;
  label: string;
}

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  scales,
  selectedScale,
  onChange,
  label,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className="block w-full rounded-lg border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        value={selectedScale.name}
        onChange={(e) => {
          const scale = scales.find((s) => s.name === e.target.value);
          if (scale) onChange(scale);
        }}
      >
        {scales.map((scale) => (
          <option key={scale.name} value={scale.name}>
            {scale.name}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500">Example: {selectedScale.example}</p>
    </div>
  );
};