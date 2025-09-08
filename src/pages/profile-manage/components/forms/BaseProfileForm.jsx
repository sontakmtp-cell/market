import React from 'react';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';

const BaseProfileForm = ({ 
  children,
  onSubmit,
  isSubmitting = false,
  isDirty = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-32"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
};

export default BaseProfileForm;
