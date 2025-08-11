/**
 * Get the appropriate phone number based on environment
 */
export const getCallGenieNumber = (): string => {
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1';
  
  // For now, use the same number for both environments
  // You can change this later when you have different numbers
  const productionNumber = '+918035316321';
  const developmentNumber = '+918035316321';
  
  return isProduction ? productionNumber : developmentNumber;
};

/**
 * Check if we're in production environment
 */
export const isProduction = (): boolean => {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1';
};