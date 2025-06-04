import YandexMap from "./YandexMap";

const HowToFind = () => {
    return (
      <div className="bg-[#F1ADAE] py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Как нас найти</h2>
          <YandexMap />
          <p className="mt-4">
            Наш адрес: г. Сургут, ул. Ивана Захарова 11/1
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://twitter.com" target="_blank" className="hover:text-[#F4BEBC]">
                Twitter
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-[#F4BEBC]">
                Instagram
            </a>
            {/* Добавьте другие ссылки на соцсети по необходимости */}
          </div>
        </div>
      </div>
    );
  };
  
  export default HowToFind;  