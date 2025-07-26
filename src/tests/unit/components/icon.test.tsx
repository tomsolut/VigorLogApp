import { describe, it, expect } from 'vitest';
import { render } from '@/tests/utils';
import { Icon, HealthIcon, RoleIcon, SportIcon } from '@/components/ui/icon';

describe('Icon Components', () => {
  describe('Icon', () => {
    it('renders basic icon correctly', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('i');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('fa-heart-pulse');
    });

    it('applies size classes correctly', () => {
      const { container } = render(<Icon name="heart" size="2xl" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('text-2xl');
    });

    it('applies custom className', () => {
      const { container } = render(<Icon name="heart" className="text-red-500" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('text-red-500');
    });

    it('renders solid icon variant', () => {
      const { container } = render(<Icon name="heart" variant="solid" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-solid');
    });

    it('renders regular icon variant', () => {
      const { container } = render(<Icon name="heart" variant="regular" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-regular');
    });
  });

  describe('HealthIcon', () => {
    it('renders sleep icon correctly', () => {
      const { container } = render(<HealthIcon metric="sleep" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-bed');
      expect(icon).toHaveClass('text-blue-600');
    });

    it('renders mood icon correctly', () => {
      const { container } = render(<HealthIcon metric="mood" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-face-smile');
      expect(icon).toHaveClass('text-green-600');
    });

    it('renders pain icon correctly', () => {
      const { container } = render(<HealthIcon metric="pain" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-triangle-exclamation');
      expect(icon).toHaveClass('text-red-600');
    });

    it('applies custom size', () => {
      const { container } = render(<HealthIcon metric="heart" size="lg" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('text-lg');
    });
  });

  describe('RoleIcon', () => {
    it('renders athlete icon correctly', () => {
      const { container } = render(<RoleIcon role="athlete" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-person-running');
      expect(icon).toHaveClass('text-green-600');
    });

    it('renders coach icon correctly', () => {
      const { container } = render(<RoleIcon role="coach" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-whistle');
      expect(icon).toHaveClass('text-blue-600');
    });

    it('renders parent icon correctly', () => {
      const { container } = render(<RoleIcon role="parent" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-people-group');
      expect(icon).toHaveClass('text-purple-600');
    });

    it('renders admin icon correctly', () => {
      const { container } = render(<RoleIcon role="admin" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-user-shield');
      expect(icon).toHaveClass('text-orange-600');
    });
  });

  describe('SportIcon', () => {
    it('renders football icon correctly', () => {
      const { container } = render(<SportIcon sport="fußball" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-futbol');
    });

    it('renders basketball icon correctly', () => {
      const { container } = render(<SportIcon sport="basketball" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-basketball');
    });

    it('renders tennis icon correctly', () => {
      const { container } = render(<SportIcon sport="tennis" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-tennis-ball');
    });

    it('renders default sport icon for unknown sport', () => {
      const { container } = render(<SportIcon sport="unknown-sport" />);
      const icon = container.querySelector('i');
      expect(icon).toHaveClass('fa-futbol');
    });
  });
});