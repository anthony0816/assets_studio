"use client";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import { CreateAsset, TranslateSelectedWords } from "@/utils/functions";
import { useAuth } from "@/context/authContext";
import LoadingSpinner from "@/Components/LoadingSpiner";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import CategorySelector from "@/Components/CategorySelector";
import DeleteIcon from "@/Icons/DeleteIcon";
import { keyWords as words } from "@/utils/consts";
import { fileToBase64 } from "@/utils/functions";
import { TranslateArrayString } from "@/utils/functions";

export default function UploadAsset() {
  const { currentTheme } = useTheme();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;
  const [file, setFile] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const { router } = useLoadingRouter();
  const [inputKeyWord, setInputKeyWord] = useState("");

  // Palabras clave que se van seleccionando
  const [keyWords, setKeyWords] = useState(words);
  const [selectedKeyWords, setSelectedKeyWords] = useState([]);

  const [currentLenguage, setCurretLenguague] = useState("en");
  const lenguagues = [
    { name: "English", leng: "en" },
    { name: "Español", leng: "es" },
  ];

  useEffect(() => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }, [file]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedKeyWords.length < 3)
      return alert(
        "Elige al menos 3 palabras claves, Pick al least 3 keywords"
      );

    if (isLoading) return;
    setIsLoading(true);

    if (!categoria) return setIsLoading(false);
    const base64file = await fileToBase64(file);
    if (!user) {
      setIsLoading(false);
      router("/login");
      return;
    }
    const translatedSelectedKeyWords = await TranslateSelectedWords(
      selectedKeyWords
    );

    const data = await CreateAsset(
      base64file,
      user?.uid,
      user?.providerId,
      categoria,
      translatedSelectedKeyWords
    );
    setIsLoading(false);
    const { url, error } = data;
    console.log("Backend Create Asset", url);
    if (error) {
      console.error("Error while uploading asset:", error);
      return alert("Error while uploading asset");
    }
    setFile(null);
    setCategoria("");
    setSelectedKeyWords([]);
  }

  function VerifySelected(word) {
    return selectedKeyWords.some((key) => key.word == word);
  }
  function SelectKeyWord(word) {
    if (!isValidWord(word)) return;
    if (selectedKeyWords.length >= 10) return;
    if (selectedKeyWords.some((keyWords) => keyWords.word == word)) return;
    setSelectedKeyWords((prev) => [
      ...prev,
      { word, lenguague: keyWords[keyWords.length - 1].lenguague },
    ]);
    setInputKeyWord("");
  }
  function RemoveSelectedKeyWord(word) {
    setSelectedKeyWords((prev) => {
      return prev.filter((dato) => dato != word);
    });
  }

  // valida la palabra
  function isValidWord(word) {
    const maxLength = 50;

    // Verificar longitud
    if (word.trim().length === 0 || word.trim().length > maxLength)
      return false;

    // Verificar caracteres prohibidos
    if (/[<>{}[\]\\]/.test(word)) return false;

    return true;
  }

  function translate(to) {
    if (to == currentLenguage) return;
    console.log("current:", currentLenguage, "to:", to);
    TranslateArrayString({
      array: keyWords,
      from: currentLenguage,
      to: to,
    })
      .then((data) => setKeyWords(data))
      .then(setCurretLenguague(to));
  }

  return (
    <div className="h-[100%] overflow-y-auto">
      <div
        className={`min-h-screen  ${color.primary} ${tcolor.primary} flex items-center justify-center`}
      >
        <div
          className={`${color.third} rounded-lg shadow-lg w-full max-w-lg p-8 space-y-6`}
        >
          <h1 className="text-2xl font-bold text-center">Upload Asset</h1>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            {/* SRC */}
            <div className="w-full flex text-center">
              {!file && (
                <label
                  className={`w-full border ${color.border} ${tcolor.primary} font-medium py-2 px-4 h-40 rounded-lg transition cursor-pointer flex items-center justify-center`}
                >
                  find your asset in local store
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    placeholder="https://..."
                    className="hidden"
                  />
                </label>
              )}

              {file && (
                <div className="relative mx-auto min-w-50 min-h-50">
                  <div
                    onClick={() => {
                      setFile(null);
                      setSelectedKeyWords([]);
                    }}
                    className="absolute right-2 bottom-2 bg-gray-800/90 p-4 hover:bg-gray-800 transition rounded-xl "
                  >
                    <DeleteIcon />
                  </div>
                  <img
                    src={preview}
                    className="object-contain w-full h-full rounded"
                  ></img>
                </div>
              )}
            </div>

            {/* Categoría */}
            {file && (
              <div className="flex flex-col justify-center items-center">
                <select
                  required
                  onChange={(e) => {
                    if (e.target.value.startsWith("cat-")) {
                      return setCategoria(e.target.value.split("-")[1]);
                    }
                    setCategoria(e.target.value);
                  }}
                  className={`w-[90%] whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
                >
                  <option value="">Select a category</option>
                  <CategorySelector />
                </select>
              </div>
            )}

            {/* Palabras Clave */}
            {file && (
              <div className="space-y-4">
                <h2 className={`text-center border-b p-2 ${color.border}`}>
                  Key Words
                </h2>
                <p className={`${tcolor.muted} text-center text-sm`}>
                  These keywords help the asset appear in search results.
                </p>
                {/* Seleccionados */}
                {selectedKeyWords.length > 0 && (
                  <>
                    <div className={`border-b ${color.border}`}>
                      <header className="flex  items-center justify-between py-1">
                        <h3 className="">Selected:</h3>

                        {/* Options */}

                        <div
                          onClick={() => setSelectedKeyWords([])}
                          className={`flex items-center transition p-1 bg-red-400/70 border ${color.border} hover:bg-red-400 rounded-xl cursor-pointer`}
                        >
                          <p> Remove All</p>
                          <DeleteIcon />{" "}
                        </div>
                      </header>

                      <div className="flex flex-wrap gap-1 py-2 items-center">
                        <>
                          {selectedKeyWords.map((word, i) => (
                            <div
                              onClick={() => RemoveSelectedKeyWord(word)}
                              key={word.word}
                              className={` transition  border ${color.border} ${color.primary} p-2 rounded-xl hover:scale-95 cursor-pointer `}
                            >
                              {word.word}
                            </div>
                          ))}
                          <div className=" ml-auto">
                            {selectedKeyWords.length}/10
                          </div>
                        </>
                      </div>
                    </div>
                  </>
                )}
                {/* Add a key word */}
                <div className={` ${color.primary} p-2 rounded-xl`}>
                  <div className={`flex justify-center p-1 `}>
                    <div
                      className={` space-x-2 rounded-xl w-full flex justify-center p-1`}
                    >
                      <input
                        value={inputKeyWord}
                        onChange={(e) => setInputKeyWord(e.target.value)}
                        type="text"
                        className={`outline-none border ${color.border} rounded-xl px-2 `}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          selectedKeyWords.length < 10 &&
                          inputKeyWord != "" &&
                          SelectKeyWord(inputKeyWord)
                        }
                        className={`border ${color.border} ${color.buttonPrimary} ${color.buttonPrimaryHover} p-1 rounded-xl`}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                  <p className={` text-center text-sm ${tcolor.muted}`}>
                    The word you enter here for the tag must be written in the
                    language selected below so that it can be translated
                    correctly
                  </p>
                </div>
                {/* Opciones de Traduccion */}
                <div className="flex justify-center">
                  <ul className={`flex space-x-3`}>
                    {lenguagues.map((l) => (
                      <li
                        onClick={() => translate(l.leng)}
                        key={l.name}
                        className={` border-b-3 transition ${
                          currentLenguage == l.leng
                            ? ` ${color.border}`
                            : `border-gray-600/0`
                        } pb-2 cursor-pointer`}
                      >
                        {l.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keywords para seleccionar  */}

                <p className={`text-center text-sm w-full ${tcolor.muted}`}>
                  No matter which language you choose, the tags will be included
                  in either Spanish or English.
                </p>

                <div
                  className={`flex flex-wrap justify-center gap-2 md:gap-3 max-h-80 overflow-y-auto `}
                >
                  {keyWords.map((word) => {
                    const { lenguague } = word;
                    if (lenguague) return;
                    return (
                      <div
                        onClick={() => SelectKeyWord(word)}
                        key={word}
                        className={` transition duration-300 ${
                          color.primary
                        } border ${
                          color.border
                        }    p-2 hover:scale-95   rounded-xl cursor-pointer ${
                          VerifySelected(word) ? "bg-green-500" : ""
                        } `}
                      >
                        {word}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botón */}
            <div className="pt-4">
              <button
                disabled={file == null || isLoading}
                type="submit"
                className={`w-full ${color.buttonPrimary} ${
                  color.buttonPrimaryHover
                } text-white font-medium py-2 px-4 rounded-lg transition ${
                  !file && "opacity-50"
                }`}
              >
                {isLoading ? <LoadingSpinner color="white" /> : "Upload Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
