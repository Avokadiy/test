"use client";

import React, { useEffect } from "react";

const YandexMap = () => {
  useEffect(() => {
    if (window.ymaps) return; // Проверяем, был ли уже загружен API

    const ymapsScript = document.createElement("script");
    ymapsScript.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=YOUR_API_KEY";
    ymapsScript.onload = () => {
      ymaps.ready(() => {
        const map = new ymaps.Map("map", {
          center: [61.247980, 73.457899],
          zoom: 18,
        });

        const placemark = new ymaps.Placemark(
          [61.247980, 73.457899],
          {
            balloonContent: "Наше местоположение",
          },
          {
            preset: "islands#redIcon",
          }
        );

        map.geoObjects.add(placemark);
      });
    };
    document.head.appendChild(ymapsScript);

    return () => {
      if (ymapsScript.parentNode) {
        ymapsScript.parentNode.removeChild(ymapsScript);
      }
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full mt-10">
      {/* Левая часть с текстом */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-2xl font-bold mb-4 text-[#9E0E05]">Как нас найти?</h2>
        <p className="text-gray-700">
          Мы находимся по адресу: <br />
          <strong>г. Сургут, ул. Ивана Захарова 11/1</strong> <br />
          <br />
          Вы можете воспользоваться картой справа, чтобы легко добраться до нас!
        </p>
      </div>

      {/* Правая часть с картой */}
      <div className="w-full md:w-1/2 h-[400px] rounded-lg shadow-md overflow-hidden">
        <div
          id="map"
          className="w-full h-full"
          style={{
            borderRadius: "10px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default YandexMap;