import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialogStore } from '@/store/dialogStore';
import { useTranslation } from 'react-i18next';

export function ConfirmDialog() {
  const { t } = useTranslation();
  const { isOpen, options, onConfirm, onCancel, closeDialog } = useDialogStore();

  if (!options) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${options.destructive ? 'text-destructive' : 'text-primary'}`}>
            {options.title}
          </DialogTitle>
          <DialogDescription className="text-foreground pt-4">
            {options.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 space-x-2">
          <Button variant="outline" onClick={onCancel}>
            {options.cancelText || t('common.cancel')}
          </Button>
          <Button 
            variant={options.destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {options.confirmText || t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
