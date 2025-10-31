const Select = ({ label, value, onChange, options }) => {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={label}>{label}</label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
