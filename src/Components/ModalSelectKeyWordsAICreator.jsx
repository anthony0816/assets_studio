import { useState } from "react";
import Modal from "./Modal";
import { keyWords as words } from "@/utils/consts";
import { useTheme } from "@/context/themeContext";
import { TranslateArrayString } from "@/utils/functions";

export default function ModalSelectKeyWordsAICreator({
  isOpen,
  onClose,
  onSucces,
}) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  const [keyWords, setKeyWords] = useState(
    words.filter((word) => typeof word != "object")
  );
  const [selectedWords, setSelectedWords] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [customTag, setCustomTag] = useState("");

  // Función para manejar la selección/deselección de palabras
  const handleWordClick = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      if (selectedWords.length < 10) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  // Función para agregar tag manualmente
  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedWords.includes(customTag.trim())) {
      if (selectedWords.length < 10) {
        setSelectedWords([...selectedWords, customTag.trim()]);
        setCustomTag("");
      }
    }
  };

  // Función para manejar la tecla Enter en el input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddCustomTag();
    }
  };

  // Función para manejar la traducción alternada (solo afecta a las sugeridas)
  const handleTranslate = async () => {
    if (isTranslating) return;

    setIsTranslating(true);
    try {
      const targetLanguage = currentLanguage === "en" ? "es" : "en";

      const translatedWords = await TranslateArrayString({
        array: keyWords,
        from: currentLanguage,
        to: targetLanguage,
      });

      const translatedStrings = translatedWords.filter(
        (word) => typeof word === "string"
      );

      setKeyWords(translatedStrings);
      setCurrentLanguage(targetLanguage);

      // NO traducimos las palabras seleccionadas
    } catch (error) {
      console.error("Error translating:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Función para aceptar y enviar las palabras seleccionadas
  const handleAccept = async () => {
    if (isAccepting) return;

    // Validar que se hayan seleccionado al menos 3 palabras
    if (selectedWords.length < 3) {
      alert("Please select at least 3 tags");
      return;
    }

    setIsAccepting(true);
    try {
      await onSucces(selectedWords);
      onClose();
    } catch (error) {
      console.error("Error in onSucces:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Modal
      modalAbsolute
      isOpen={isOpen}
      onClose={onClose}
      showButtomnClose={false}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`p-4 ${color.primary} ${tcolor.primary} rounded-lg w-full max-w-md mx-4`}
      >
        <h2 className="text-xl font-bold mb-4">Select keywords</h2>

        {/* Current language indicator */}
        <div className={`mb-3 text-sm ${tcolor.muted}`}>
          Current language: {currentLanguage === "en" ? "English" : "Spanish"}
        </div>

        {/* Custom tag input */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add custom tag..."
            className={`flex-1 px-3 py-2 rounded border ${color.border} ${color.secondary} ${tcolor.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            className={`px-4 py-2 rounded ${color.buttonPrimary} ${
              tcolor.primary
            } ${color.buttonPrimaryHover} transition-colors ${
              !customTag.trim() || selectedWords.length >= 10
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleAddCustomTag}
            disabled={!customTag.trim() || selectedWords.length >= 10}
          >
            Add
          </button>
        </div>

        {/* Selected tags */}
        {selectedWords.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Selected tags:</h3>
              <span className={`text-xs ${tcolor.muted}`}>
                {selectedWords.length}/10{" "}
                {selectedWords.length < 3 && "(minimum 3 required)"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className={`px-3 py-1 rounded ${color.buttonPrimary} ${tcolor.primary} transition-colors hover:opacity-80`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keywords grid with fixed height and scroll */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Suggested tags:</h3>
            {selectedWords.length > 0 && (
              <span className={`text-xs ${tcolor.muted}`}>
                {selectedWords.length}/10 selected
              </span>
            )}
          </div>
          <div className="h-78 overflow-y-auto border rounded-lg p-3">
            <div className="flex flex-wrap gap-2">
              {keyWords.map((word, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 rounded border text-sm ${
                    selectedWords.includes(word)
                      ? `${color.buttonPrimary} ${tcolor.primary}`
                      : `${color.secondary} ${tcolor.secondary} ${color.border}`
                  } transition-colors`}
                  onClick={() => handleWordClick(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded ${
              color.buttonPrimary
            } ${tcolor.primary} ${color.buttonPrimaryHover} transition-colors ${
              isTranslating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating
              ? "Translating..."
              : `Translate to ${
                  currentLanguage === "en" ? "Spanish" : "English"
                }`}
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className={`flex-1 px-4 py-2 rounded ${color.secondary} ${
                tcolor.primary
              } ${color.hover} transition-colors ${
                isAccepting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onClose}
              disabled={isAccepting}
            >
              Cancel
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded ${color.buttonPrimary} ${
                tcolor.primary
              } ${color.buttonPrimaryHover} transition-colors ${
                selectedWords.length === 0 || isAccepting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleAccept}
              disabled={selectedWords.length === 0 || isAccepting}
            >
              {isAccepting
                ? "Processing..."
                : `Accept (${selectedWords.length})`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
