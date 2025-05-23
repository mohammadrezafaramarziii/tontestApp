import React from 'react'

export default function TextField({ name, placeholder, type, onChange, value }) {
    return (
        <div>
            <input
                type={type}
                id={name}
                name={name}
                className="w-full appearance-none outline-none disabled:opacity-40 p-4 bg-blue-100 border-2 border-transparent focus:border-blue-600 duration-200 rounded-xl text-slate-900 placeholder-slate-500 font-medium;"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
