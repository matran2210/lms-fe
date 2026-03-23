import ExtensionRegistry from './ExtensionRegistry';
import RedirectNotBuyPage from './RedirectNotBuyPage';

export interface SlotProps {
  name: string;
  [key: string]: any;
}

const Slot: React.FC<SlotProps> = ({ name, ...props }) => {
  const Extensions = ExtensionRegistry.getExtensions(name);
  console.log('Extensions', Extensions);
  if (!Extensions || Extensions.length === 0) {
    console.warn(`No extension found for slot: ${name}`);
    return <RedirectNotBuyPage />;
  }

  return (
    <>
      {Extensions.map((Ext, index) => (
        <Ext key={`${name}-${index}`} {...props} />
      ))}
    </>
  );
};

export default Slot