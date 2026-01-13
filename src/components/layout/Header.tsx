export default function Header() {
  return (
    <header>

      <div className="overflow-hidden fixed left-4 lg:left-8 right-4 lg:right-8 top-4 lg:top-5 grid grid-cols-12 gap-4 lg:gap-8 z-50 font-medium text-[20px]">

        {/* Col 1: Location */}
        <div className="col-span-3 flex flex-col items-start gap-0.8">
          <span className="font-semibold text-foreground">Prague Based</span>
          <span className="font-medium text-muted">Will work globally</span>
        </div>

        {/* Col 2: Status */}
        <div className="col-span-3 flex flex-col items-start gap-0.8">
          <span className="font-semibold text-foreground">Currently</span>
          <span className="font-medium text-muted">Learning Three.js</span>
        </div>

        {/* Col 3: Local Time */}
        <div className="col-span-3 flex flex-col items-start gap-0.8">
          <span className="font-semibold text-foreground">Local time</span>
          <span className="font-medium text-muted">22:03 GMT+</span>
        </div>



      </div>

      <div className="fixed right-4 lg:right-8 top-4 lg:top-6 group cursor-pointer z-50">
        <button className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3.5 rounded-[20px] font-semibold text-[1.25rem] cursor-pointer">
          Get in touch
        </button>
      </div>

    </header>
  );
}
