function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export default Input;
