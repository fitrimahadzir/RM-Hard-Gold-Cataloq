import React from 'react';
import { ArrowLeft } from 'lucide-react';

const AIRTABLE_FORM_URL =
  'https://airtable.com/embed/appCxDAZHPIW8aJfG/pagiAFuhk6Pf9vYpw/form';

interface AddProductPageProps {
  onBack: () => void;
}

export const AddProductPage: React.FC<AddProductPageProps> = ({ onBack }) => {
  return (
    <div className="w-full px-6 md:px-12 lg:px-16 pt-8">
      <div className="flex flex-col items-center text-center mb-6 md:mb-8">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-[56px] font-thin text-[#F2D6D6]">
          Add New Product
        </h1>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#E8CFCF]/60 mt-1">
          Submit a new piece to the RM Atelier catalog
        </p>
      </div>

      <div className="w-full rounded-[16px] md:rounded-[20px] border border-[#F2D6D6]/15 overflow-hidden bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <iframe
          className="airtable-embed w-full block"
          src={AIRTABLE_FORM_URL}
          title="Add new product"
          width="100%"
          height={720}
          style={{ background: 'transparent', border: 0 }}
        />
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[6px] border border-[#F2D6D6]/40 hover:border-[#F2D6D6]/80 text-[#F2D6D6] text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to catalog
        </button>
      </div>
    </div>
  );
};
