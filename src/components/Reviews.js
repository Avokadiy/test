import Image from "next/image";

const Reviews = () => {
    return (
      <div className="bg-white py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#9E0E05]">Отзывы покупателей</h2>
          <div className="flex justify-center gap-6 mt-4">
            <div className="w-1/3">
              <Image
                src="/images/bouquet.jpg"
                alt="Отзыв 1"
                className="rounded-full w-24 h-24 mx-auto"
              />
              <p className="mt-4">&quot;Прекрасный вкус, доставка вовремя!&quot;</p>
            </div>
            <div className="w-1/3">
              <Image
                src="/images/bouquet.jpg"
                alt="Отзыв 2"
                className="rounded-full w-24 h-24 mx-auto"
              />
              <p className="mt-4">&quot;Супер сервис, всегда свежие продукты!&quot;</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Reviews;