package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.layout.Alignment
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.background
import androidx.glance.unit.ColorProvider
import androidx.glance.text.TextStyle
import androidx.glance.text.FontWeight
import androidx.glance.text.TextAlign

class VinylWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .background(ComposeColor.Black)
                        .padding(8.dp),
                    verticalAlignment = Alignment.Vertical.CenterVertically,
                    horizontalAlignment = Alignment.Horizontal.CenterHorizontally
                ) {
                    // Header Status
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().padding(bottom = 4.dp),
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Box(modifier = GlanceModifier.size(4.dp).background(ComposeColor(0xFFFF3B30))) {}
                        Spacer(modifier = GlanceModifier.width(6.dp))
                        Text(
                            text = "VINYL_DECK_PRO",
                            style = TextStyle(color = ColorProvider(ComposeColor.White.copy(alpha = 0.4f)), fontSize = 7.sp, fontWeight = FontWeight.Bold)
                        )
                    }
                    
                    Spacer(modifier = GlanceModifier.height(4.dp))

                    // The Disc
                    Box(
                        modifier = GlanceModifier
                            .size(110.dp)
                            .background(ComposeColor.DarkGray.copy(alpha = 0.2f))
                            .padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = GlanceModifier
                                .fillMaxSize()
                                .background(ComposeColor.Black),
                            contentAlignment = Alignment.Center
                        ) {
                            // High Fidelity Groove Patterns (Dots)
                            repeat(4) { i ->
                                Box(
                                    modifier = GlanceModifier
                                        .size((90 - (i * 18)).dp)
                                        .background(ComposeColor.White.copy(alpha = 0.03f))
                                ) {}
                            }
                            
                            // Matrix Pulse indication
                            Row(modifier = GlanceModifier.fillMaxWidth().height(1.dp)) {
                                repeat(20) { j ->
                                    Box(
                                        modifier = GlanceModifier.size(1.dp).background(ComposeColor.White.copy(alpha = 0.1f))
                                    ) {}
                                    Spacer(modifier = GlanceModifier.defaultWeight())
                                }
                            }
                            
                            // Center Label
                            Box(
                                modifier = GlanceModifier
                                    .size(36.dp)
                                    .background(ComposeColor(0xFFFF3B30)),
                                contentAlignment = Alignment.Center
                            ) {
                                Box(
                                    modifier = GlanceModifier
                                        .size(12.dp)
                                        .background(ComposeColor.Black)
                                ) {}
                            }
                        }
                    }
                    
                    Spacer(modifier = GlanceModifier.height(8.dp))
                    
                    Text(
                        text = "33_1/3 RPM // SYNCED",
                        style = TextStyle(color = ColorProvider(ComposeColor.White), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    )
                }
            }
        }
    }
}
