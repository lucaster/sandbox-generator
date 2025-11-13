function d(faces: number): () => number {
  return () => Math.floor(Math.random() * faces) + 1;
}

function dd(howmany: number): (faces: number) => number {
  return (faces: number) => {
    const results = Array.from(
        { length: howmany },
        () => d(faces)()
    );
    var sum = results.reduce((acc, curr) => acc + curr, 0);
    return sum;
  };
}

const d20 = () => d(20)();
const d12 = () => d(12)();
const d10 = () => d(10)();
const d8 = () => d(8)();
const d6 = () => d(6)();
const d4 = () => d(4)();
const d3 = () => d(3)();
const d2 = () => d(2)();

export { d, dd, d20, d12, d10, d8, d6, d4, d3, d2 };
