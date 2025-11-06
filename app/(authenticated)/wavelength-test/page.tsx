"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { WavelengthBlob } from "@/components/ui/wavelength-blob";

export default function WavelengthTestPage() {
  const [wavelength, setWavelength] = useState(65);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Wavelength Components Test</h1>
        <p className="text-muted-foreground">
          Compare WavelengthIndicator and WavelengthBlob components
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Wavelength Value: {wavelength}%
            </label>
            <Slider
              value={[wavelength]}
              onValueChange={(value) => setWavelength(value[0] ?? 0)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* WavelengthIndicator */}
      <Card>
        <CardHeader>
          <CardTitle>1. WavelengthIndicator</CardTitle>
          <p className="text-sm text-muted-foreground">
            Location: <code>components/wavelength-indicator.tsx</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Features: Card-based display with gradient background, animated
            pulse, icon based on value, mini progress bar
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive Demo</h3>
            <WavelengthIndicator wavelength={wavelength} userName="Test User" />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Different Wavelength Ranges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Low (25%)</h4>
                <WavelengthIndicator wavelength={25} userName="Test User" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Medium (55%)</h4>
                <WavelengthIndicator wavelength={55} userName="Test User" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">High (85%)</h4>
                <WavelengthIndicator wavelength={85} userName="Test User" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Variants Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Horizontal (Default)
                </h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="horizontal"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Vertical</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Compact Vertical</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="compact-vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Compact Horizontal</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="compact-horizontal"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Badge</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="badge"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Badge Variant</h3>
            <p className="text-sm text-muted-foreground">
              Compact inline badge perfect for tags, labels, and inline
              displays. Features pulsating icon.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Interactive Examples
                </h4>
                <div className="flex flex-wrap gap-3 items-center">
                  <WavelengthIndicator
                    wavelength={wavelength}
                    userName="Test User"
                    variant="badge"
                  />
                  <WavelengthIndicator
                    wavelength={25}
                    userName="Test User"
                    variant="badge"
                  />
                  <WavelengthIndicator
                    wavelength={55}
                    userName="Test User"
                    variant="badge"
                  />
                  <WavelengthIndicator
                    wavelength={85}
                    userName="Test User"
                    variant="badge"
                  />
                  <WavelengthIndicator
                    wavelength={95}
                    userName="Test User"
                    variant="badge"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">
                  In Context (Example Usage)
                </h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">
                        Completed your Qwirl
                      </p>
                    </div>
                    <WavelengthIndicator
                      wavelength={87}
                      userName="John Doe"
                      variant="badge"
                    />
                  </div>
                  <div className="p-3 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-muted-foreground">
                        Answered 12/15 questions
                      </p>
                    </div>
                    <WavelengthIndicator
                      wavelength={64}
                      userName="Jane Smith"
                      variant="badge"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Compact Vertical Variant</h3>
            <p className="text-sm text-muted-foreground">
              Minimalist vertical layout perfect for cards and grids. Features
              mini vertical progress bar.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Interactive</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="compact-vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Low (25%)</h4>
                <WavelengthIndicator
                  wavelength={25}
                  userName="Test User"
                  variant="compact-vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Medium (55%)</h4>
                <WavelengthIndicator
                  wavelength={55}
                  userName="Test User"
                  variant="compact-vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">High (85%)</h4>
                <WavelengthIndicator
                  wavelength={85}
                  userName="Test User"
                  variant="compact-vertical"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Compact Horizontal Variant
            </h3>
            <p className="text-sm text-muted-foreground">
              Minimalist horizontal layout ideal for inline display and tight
              spaces. Features mini horizontal progress bar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Interactive</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="compact-horizontal"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Low (25%)</h4>
                <WavelengthIndicator
                  wavelength={25}
                  userName="Test User"
                  variant="compact-horizontal"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Medium (55%)</h4>
                <WavelengthIndicator
                  wavelength={55}
                  userName="Test User"
                  variant="compact-horizontal"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">High (85%)</h4>
                <WavelengthIndicator
                  wavelength={85}
                  userName="Test User"
                  variant="compact-horizontal"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vertical Variant Examples</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Interactive</h4>
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName="Test User"
                  variant="vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Low (25%)</h4>
                <WavelengthIndicator
                  wavelength={25}
                  userName="Test User"
                  variant="vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Medium (55%)</h4>
                <WavelengthIndicator
                  wavelength={55}
                  userName="Test User"
                  variant="vertical"
                />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">High (85%)</h4>
                <WavelengthIndicator
                  wavelength={85}
                  userName="Test User"
                  variant="vertical"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WavelengthBlob */}
      <Card>
        <CardHeader>
          <CardTitle>2. WavelengthBlob (Sine Wave)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Location: <code>components/ui/wavelength-blob.tsx</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Features: Animated sine wave visualization, wave properties change
            based on percentage, turbulence effect for low scores, dynamic
            colors, size variants
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive Demo</h3>
            <div className="flex justify-center">
              <WavelengthBlob percent={wavelength} size="md" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Size Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Small Size</h4>
                <WavelengthBlob percent={wavelength} size="sm" />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Medium Size</h4>
                <WavelengthBlob percent={wavelength} size="md" />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Large Size</h4>
                <WavelengthBlob percent={wavelength} size="lg" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rounded Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Rounded Small</h4>
                <WavelengthBlob percent={wavelength} size="sm" rounded />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Rounded Medium</h4>
                <WavelengthBlob percent={wavelength} size="md" rounded />
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Rounded Large</h4>
                <WavelengthBlob percent={wavelength} size="lg" rounded />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Different Wavelength Ranges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Low (15%)</h4>
                <WavelengthBlob percent={15} size="sm" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Flat, slow wave
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Medium-Low (40%)</h4>
                <WavelengthBlob percent={40} size="sm" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Gentle waves
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">Medium-High (70%)</h4>
                <WavelengthBlob percent={70} size="sm" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Active waves
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium mb-2">High (95%)</h4>
                <WavelengthBlob percent={95} size="sm" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Dynamic, fast wave
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Side-by-Side Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">
            All components at the current wavelength value: {wavelength}%
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
                Horizontal
              </h3>
              <WavelengthIndicator
                wavelength={wavelength}
                userName="Test User"
                variant="horizontal"
              />
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
                Vertical
              </h3>
              <WavelengthIndicator
                wavelength={wavelength}
                userName="Test User"
                variant="vertical"
              />
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
                Compact Vertical
              </h3>
              <WavelengthIndicator
                wavelength={wavelength}
                userName="Test User"
                variant="compact-vertical"
              />
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
                Compact Horizontal
              </h3>
              <WavelengthIndicator
                wavelength={wavelength}
                userName="Test User"
                variant="compact-horizontal"
              />
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
                Badge
              </h3>
              <WavelengthIndicator
                wavelength={wavelength}
                userName="Test User"
                variant="badge"
              />
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
                WavelengthBlob
              </h3>
              <WavelengthBlob percent={wavelength} size="md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Component Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">WavelengthIndicator</h4>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  ✅ <strong>Pros:</strong>
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                  <li>Comprehensive information display</li>
                  <li>Clear visual hierarchy</li>
                  <li>Good for detail/completion pages</li>
                  <li>Three variants: horizontal, vertical, and compact</li>
                  <li>Animated pulse effect adds engagement</li>
                  <li>Solid color progress bar (no gradients)</li>
                </ul>
              </div>
              <div className="space-y-1 pt-2">
                <p className="text-sm text-muted-foreground">
                  ❌ <strong>Cons:</strong>
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                  <li>Takes more space (especially horizontal)</li>
                  <li>More complex implementation</li>
                  <li>Might be overkill for simple displays</li>
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium">
                  <strong>Best Use Cases:</strong>
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                  <li>
                    <strong>Horizontal:</strong> Qwirl completion screens, user
                    profile pages, full-width displays
                  </li>
                  <li>
                    <strong>Vertical:</strong> Sidebars, mobile views,
                    navigation panels
                  </li>
                  <li>
                    <strong>Compact Vertical:</strong> User cards in grids,
                    vertical badge displays, profile previews
                  </li>
                  <li>
                    <strong>Compact Horizontal:</strong> Inline badges, list
                    items, compact headers, tight spaces
                  </li>
                  <li>
                    <strong>Badge:</strong> Tags, labels, inline text, user
                    mentions, compact indicators
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-lg">WavelengthBlob</h4>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  ✅ <strong>Pros:</strong>
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                  <li>Most creative and unique design</li>
                  <li>Wave metaphor perfectly fits concept</li>
                  <li>Dynamic animation based on value</li>
                  <li>Multiple size and shape variants</li>
                  <li>Visually engaging and memorable</li>
                </ul>
              </div>
              <div className="space-y-1 pt-2">
                <p className="text-sm text-muted-foreground">
                  ❌ <strong>Cons:</strong>
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                  <li>Complex animation (potential performance impact)</li>
                  <li>More code to maintain</li>
                  <li>Requires more rendering resources</li>
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium">
                  <strong>Best Use Cases:</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Landing pages, hero sections, marketing materials, feature
                  showcases
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold mb-2">💡 Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Keep both components</strong> as they serve different
              purposes:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside ml-2 mt-2 space-y-1">
              <li>
                <strong>WavelengthIndicator</strong> for functional,
                information-rich contexts
              </li>
              <li>
                <strong>WavelengthBlob</strong> for creative, attention-grabbing
                contexts
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
