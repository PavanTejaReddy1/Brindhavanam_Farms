import SectionHeader from "../components/SectionHeader";
import { COMPARE_ROWS } from "../lib/constants";

export default function Compare() {
  return (
    <section id="compare" className="py-24 px-[5%] bg-cream">
      <SectionHeader
        eyebrow="The Difference"
        title="Why We're Not Like the Others"
        subtitle="A side-by-side look at what makes Brindhavanam Farms truly different."
      />
      <div className="reveal bg-white rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-6 py-5 text-xs font-semibold uppercase tracking-wider text-gray-400 w-[45%]">
                  Feature
                </th>
                <th
                  className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-white w-[27.5%]"
                  style={{ background: "#1F4D3A" }}
                >
                  🌿 Brindhavanam Farms
                </th>
                <th className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 w-[27.5%]">
                  Other Brands
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className="hover:bg-green-50/30 transition-colors"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
                >
                  <td
                    className="px-6 py-4 text-sm font-medium"
                    style={{ color: "#1a1a1a" }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="px-6 py-4 text-center text-lg"
                    style={{ background: "rgba(31,77,58,0.03)" }}
                  >
                    {row.us === true ? (
                      <span className="text-green-500 font-bold text-xl">✓</span>
                    ) : (
                      <span className="text-sm text-gray-500">{row.us}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.them === false ? (
                      <span className="text-red-400 text-xl">✗</span>
                    ) : (
                      <span className="text-sm text-gray-500">{row.them}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}