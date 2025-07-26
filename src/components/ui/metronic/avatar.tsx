// Metronic Avatar Component - Adapted for VigorLog
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const avatarStatusVariants = cva(
  'absolute bottom-0 right-0 flex items-center rounded-full border-2 border-background',
  {
    variants: {
      variant: {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        busy: 'bg-yellow-500',
        away: 'bg-blue-500',
        training: 'bg-purple-500',
      },
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
      },
    },
    defaultVariants: {
      variant: 'offline',
      size: 'md',
    },
  }
);

interface MetronicAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  status?: VariantProps<typeof avatarStatusVariants>['variant'];
}

const MetronicAvatar = React.forwardRef<HTMLDivElement, MetronicAvatarProps>(
  ({ className, src, alt, fallback, size, status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            {fallback}
          </div>
        )}
        {status && (
          <span className={cn(avatarStatusVariants({ variant: status, size }))} />
        )}
      </div>
    );
  }
);

MetronicAvatar.displayName = 'MetronicAvatar';

// Avatar Group Component
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  children, 
  max = 3, 
  size = 'md',
  className, 
  ...props 
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-3', className)} {...props}>
      {React.Children.map(visibleChildren, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            size,
            className: cn(
              'ring-2 ring-background',
              child.props.className
            ),
            style: { zIndex: visibleChildren.length - index },
          });
        }
        return child;
      })}
      {remainingCount > 0 && (
        <MetronicAvatar
          size={size}
          className="ring-2 ring-background"
          fallback={<span className="text-xs font-medium">+{remainingCount}</span>}
        />
      )}
    </div>
  );
};

// Athlete Avatar for VigorLog
interface AthleteAvatarProps extends MetronicAvatarProps {
  name: string;
  healthStatus?: 'excellent' | 'good' | 'moderate' | 'poor';
}

const AthleteAvatar: React.FC<AthleteAvatarProps> = ({ 
  name, 
  healthStatus, 
  status = 'offline',
  ...props 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const healthBorderColor = {
    excellent: 'ring-green-500',
    good: 'ring-lime-500',
    moderate: 'ring-yellow-500',
    poor: 'ring-red-500',
  };

  return (
    <MetronicAvatar
      {...props}
      status={status}
      className={cn(
        healthStatus && `ring-2 ${healthBorderColor[healthStatus]}`,
        props.className
      )}
      fallback={<span className="font-medium">{getInitials(name)}</span>}
      alt={name}
    />
  );
};

// Team Avatar Stack for VigorLog
interface TeamAvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  team: Array<{
    id: string;
    name: string;
    avatar?: string;
    status?: VariantProps<typeof avatarStatusVariants>['variant'];
  }>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
}

const TeamAvatarStack: React.FC<TeamAvatarStackProps> = ({ 
  team, 
  max = 4, 
  size = 'sm',
  className,
  ...props 
}) => {
  return (
    <AvatarGroup max={max} size={size} className={className} {...props}>
      {team.map((member) => (
        <AthleteAvatar
          key={member.id}
          name={member.name}
          src={member.avatar}
          status={member.status}
        />
      ))}
    </AvatarGroup>
  );
};

export { 
  MetronicAvatar, 
  AvatarGroup, 
  AthleteAvatar, 
  TeamAvatarStack,
  avatarVariants,
  avatarStatusVariants 
};