import ExtensionRegistry from './ExtensionRegistry';
import RedirectNotBuyPage from './RedirectNotBuyPage';

export interface SlotProps {
  name: string;
  isPage?: boolean;
  className?: string;
  [key: string]: any;
}

const Slot: React.FC<SlotProps> = ({ name, isPage = true, className, ...props }) => {
  const Extensions = ExtensionRegistry.getExtensions(name);
  if (!Extensions || Extensions.length === 0) {
    console.warn(`No extension found for slot: ${name}`);
    return <div className={className}><RedirectNotBuyPage isPage={isPage} /></div>
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