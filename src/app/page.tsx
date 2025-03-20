
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Options {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const generatePassword = (length: number, options: Options): string => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~|}{[]:;?><,./-=";
  let characters = "";

  if (options.lowercase) characters += lower;
  if (options.uppercase) characters += upper;
  if (options.numbers) characters += numbers;
  if (options.symbols) characters += symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password;
};

const getStrength = (options: Options): string => {
  const selectedCount = Object.values(options).filter(Boolean).length;

  if (selectedCount === 1) return "Too Weak";
  if (selectedCount === 2) return "Weak";
  if (selectedCount === 3) return "Medium";
  if (selectedCount === 4) return "Strong";

  return "Too Weak";
};

const getStrengthImage = (strength: string): string => {
  switch (strength) {
    case "Too Weak":
      return "/TooWeak.png";
    case "Weak":
      return "/Weak.png";
    case "Medium":
      return "/Medium.png";
    case "Strong":
      return "/Strong.png";
    default:
      return "/No.png";
  }
};

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(12);
  const [options, setOptions] = useState<Options>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState<string>("FJ09!@$%psD");
  const [strength, setStrength] = useState<string>("Too Weak");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    setStrength(getStrength(options));
  }, [options]);

  const handleGenerate = () => {
    const newPassword = generatePassword(length, options);
    setPassword(newPassword);
    setStrength(getStrength(options));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };


  const strengthImage = getStrengthImage(strength);

  return (
    <div className="flex justify-center items-center flex-col h-screen bg-[#08070B] font-semibold">
      <h2 className="text-[#817D92] font-bold mb-2 text-[24px]">Password Generator</h2>

      <div className="bg-[#24232C] p-4 rounded mt-6 flex justify-between items-center w-[540px] max-sm:w-[343px] max-sm:h-[80px]">
        <span className="block text-lg font-mono text-white break-all">{password}</span>

        <button
          onClick={handleCopy}
          className="mt-3 flex items-center text-white py-2 px-4 rounded flex-row-reverse"
        >
          <Image
            src={"/copyIcone.png"}
            alt="Copy Icon"
            width={24}
            height={24}
          />
          {isCopied ? <span className="mr-3 text-[#A4FFAF] font-semibold">COPIED</span> : ""}
        </button>
      </div>

      <div className="bg-[#24232C] w-[540px] p-6 mt-6  max-sm:w-[343px]">
        <div className="mb-6">
          <div className="flex justify-between items-center text-white">
            <label className="text-white">Character Length</label>
            <label className="block mb-2 text-lg cursor-pointer">{length}</label>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[#A4FFAF] cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-4 mb-6 text-white  ">
          {Object.keys(options).map((key) => (
            <label key={key} className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-[18px] font-semibold ">
              <input
                type="checkbox"
                checked={options[key as keyof Options]}
                onChange={() =>
                  setOptions((prev) => ({ ...prev, [key]: !prev[key as keyof Options] }))
                }
                className="accent-[#A4FFAF] w-[24px]"
              />
              Include {key.charAt(0).toUpperCase() + key.slice(1)} {key === "lowercase" || key === "uppercase" ? "Letters" : ""}
            </label>
          ))}
        </div>

        <div className="text-lg font-semibold bg-[#18171F] mb-4 flex justify-between items-center max-w-[476px] h-[72px] p-4  ">
          <h1 className=" text-[#817D92]">Strength:</h1>
          <Image
            src={strengthImage}
            alt="Strength Image"
            width={700}
            height={700}
            className="w-[166px] h-[31px]"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full flex justify-center items-center bg-[#A4FFAF] hover:bg-transparent hover:text-white border-2 border-transparent hover:border-[#A4FFAF] text-[#24232C] py-3 px-6 rounded font-semibold text-lg group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          GENERATE
          <Image
            src={isHovered ? "/Garrow.png" : "/arrow.png"}
            alt="Arrow Icon"
            width={500}
            height={500}
            className="ml-2 transition-all duration-300 w-[11.5px] h-[12px]"
          />
        </button>
      </div>
    </div>
  );
}
