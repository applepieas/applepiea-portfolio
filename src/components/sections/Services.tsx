/* eslint-disable @next/next/no-img-element */

const services = [
  {
    number: "01",
    title: "Design",
    description: "I design high-fidelity interfaces and design systems. I focus on aesthetics that reflect the brand's identity while ensuring a seamless user experience."
  },
  {
    number: "02",
    title: "Development",
    description: "Evolving with every brief and built for impact, my process spans design, development, and brand strategy."
  },
  {
    number: "03",
    title: "Strategy",
    description: "Evolving with every brief and built for impact, my process spans design, development, and brand strategy."
  }
];

export default function Services() {
  return (
    <section className="w-full px-6 py-64">
      {/* Dark container with rounded corners */}
      <div className="bg-foreground text-background rounded-3xl h-full p-5 pt-25 flex flex-col">

        {/* Header section */}
        <div className="mb-16 grid grid-cols-12 gap-8">
          <div className="col-span-10 col-start-3">
            <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-6">
              Services
            </p>
            <h2 className="text-14 md:text-5xl lg:text-[3.5rem] font-semibold leading-tight">
              Building things that work and look good. From the first sketch to the final deploy, I combine design and full-stack development to turn complex ideas into sharp, high-impact digital reality
            </h2>
          </div>
        </div>

        {/* Services list */}
        <div className="bg-foreground-secondary rounded-3xl h-full px-5 py-10 mt-10 flex flex-col">
          <div className="flex-1 flex flex-col">
            {services.map((service, index) => (
              <div key={service.number}>

                {/* Service row */}
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* Number */}
                  <div className="col-span-2">
                    <span className="text-muted text-sm font-medium">
                      {service.number}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="col-span-3">
                    <h3 className="text-[56px] font-semibold">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="col-span-3">
                    <p className="text-[20px] text-background/80 leading-relaxed max-w-xs">
                      {service.description}
                    </p>
                  </div>

                  {/* Image placeholder */}
                  <div className="col-span-4">
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden">
                      <img
                        src="/image.png"
                        alt={`${service.title} preview`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider - only between rows, not after the last one */}
                {index < services.length - 1 && (
                  <div className="py-10">
                    <div className="w-full h-px bg-muted/30" />
                  </div>
                )}

              </div>

            ))}

          </div>
        </div>


      </div>
    </section>
  );
}
